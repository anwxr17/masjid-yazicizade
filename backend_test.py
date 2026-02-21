import requests
import sys
import json
from datetime import datetime

class RoadToJannahAPITester:
    def __init__(self):
        self.base_url = "https://prayer-times-hub-4.preview.emergentagent.com/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.passed_tests.append(name)
                print(f"✅ Passed - Status: {response.status_code}")
                if response.content:
                    try:
                        result = response.json()
                        print(f"   Response: {json.dumps(result, indent=2) if isinstance(result, dict) else str(result)[:200]}")
                        return True, result
                    except:
                        print(f"   Response: {response.text[:200]}")
                        return True, response.text
                return True, {}
            else:
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200] if response.text else "No response"
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test basic API health"""
        return self.run_test("API Health Check", "GET", "", 200)

    def test_get_content(self):
        """Test public content endpoint"""
        return self.run_test("Get Site Content", "GET", "content", 200)

    def test_get_announcements(self):
        """Test public announcements endpoint"""
        return self.run_test("Get Announcements", "GET", "announcements", 200)

    def test_admin_login(self):
        """Test admin login"""
        login_data = {
            "email": "admin@roadtojannah.com",
            "password": "admin123"
        }
        success, response = self.run_test("Admin Login", "POST", "auth/login", 200, login_data)
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token obtained: {self.token[:50]}...")
            return True
        return False

    def test_token_verification(self):
        """Test token verification"""
        if not self.token:
            print("❌ No token available for verification")
            return False
        return self.run_test("Token Verification", "GET", "auth/verify", 200, auth_required=True)

    def test_volunteer_submission(self):
        """Test volunteer form submission"""
        volunteer_data = {
            "name": f"Test Volunteer {datetime.now().strftime('%H%M%S')}",
            "phone": "+1234567890",
            "skills": "Teaching, Event organizing",
            "availability": "Weekends, evenings"
        }
        return self.run_test("Volunteer Submission", "POST", "volunteer", 200, volunteer_data)

    def test_admin_content_update(self):
        """Test admin content update"""
        if not self.token:
            print("❌ No token available for content update")
            return False
        
        content_update = {
            "isha_time": "8:45 PM",
            "hero_title": {
                "en": "Updated Test Title",
                "ar": "عنوان تجريبي محدث",
                "tr": "Güncellenmiş Test Başlığı"
            }
        }
        return self.run_test("Update Content", "PUT", "admin/content", 200, content_update, auth_required=True)

    def test_admin_volunteers(self):
        """Test getting volunteers list"""
        if not self.token:
            print("❌ No token available for volunteers")
            return False
        return self.run_test("Get Volunteers", "GET", "admin/volunteers", 200, auth_required=True)

    def test_admin_announcements(self):
        """Test getting all announcements"""
        if not self.token:
            print("❌ No token available for admin announcements")
            return False
        return self.run_test("Get Admin Announcements", "GET", "admin/announcements", 200, auth_required=True)

    def test_create_announcement(self):
        """Test creating announcement"""
        if not self.token:
            print("❌ No token available for announcement creation")
            return False
        
        announcement_data = {
            "title": {
                "en": f"Test Announcement {datetime.now().strftime('%H%M%S')}",
                "ar": "إعلان تجريبي",
                "tr": "Test Duyurusu"
            },
            "content": {
                "en": "This is a test announcement",
                "ar": "هذا إعلان تجريبي",
                "tr": "Bu bir test duyurusudur"
            },
            "is_active": True,
            "is_banner": False
        }
        return self.run_test("Create Announcement", "POST", "admin/announcements", 200, announcement_data, auth_required=True)

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Road to Jannah API Tests")
        print("=" * 50)
        
        # Basic connectivity
        self.test_health_check()
        
        # Public endpoints
        self.test_get_content()
        self.test_get_announcements()
        self.test_volunteer_submission()
        
        # Admin authentication
        if self.test_admin_login():
            # Admin endpoints (only if login successful)
            self.test_token_verification()
            self.test_admin_content_update()
            self.test_admin_volunteers()
            self.test_admin_announcements()
            self.test_create_announcement()
        
        # Print results
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                print(f"   - {failure.get('test', 'Unknown')}")
                if 'error' in failure:
                    print(f"     Error: {failure['error']}")
                else:
                    print(f"     Expected {failure.get('expected')}, got {failure.get('actual')}")
        
        if self.passed_tests:
            print(f"\n✅ PASSED TESTS: {', '.join(self.passed_tests)}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = RoadToJannahAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())