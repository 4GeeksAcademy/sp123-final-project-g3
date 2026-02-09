#!/usr/bin/env python3
"""
Test script for Job Application Tracker API
This script tests all the endpoints to ensure they are working correctly.
"""

import requests
import json
import sys
import time

BASE_URL = "http://localhost:3001/api"

test_user = {
    "email": "testuser@example.com",
    "password": "password123",
    "name": "Test User",
    "profesional_title": "Software Engineer"
}

test_job = {
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "location": "San Francisco, CA",
    "salary": "$100,000 - $150,000",
    "description": "Great opportunity for a senior developer"
}

test_cv = {
    "cv_url": "https://example.com/cv.pdf",
    "user_id": 1
}

class APITester:
    def __init__(self):
        self.token = None
        self.user_id = None
        self.job_id = None
        self.cv_id = None
        self.postulation_id = None
    
    def print_test_header(self, test_name):
        print(f"\n{'='*60}")
        print(f"TESTING: {test_name}")
        print(f"{'='*60}")
    
    def print_response(self, response):
        print(f"Status Code: {response.status_code}")
        try:
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"Response: {response.text}")
    
    def test_signup(self):
        self.print_test_header("User Signup")
        try:
            response = requests.post(f"{BASE_URL}/signup", json=test_user)
            self.print_response(response)
            if response.status_code == 201:
                data = response.json()
                self.user_id = data['results']['id']
                self.token = data['access_token']
                print(f"User created successfully. User ID: {self.user_id}")
                return True
            elif response.status_code == 409:
                # User already exists, try to login to get token
                print("User already exists, attempting login to get token")
                login_data = {
                    "email": test_user["email"],
                    "password": test_user["password"]
                }
                login_response = requests.post(f"{BASE_URL}/login", json=login_data)
                if login_response.status_code == 200:
                    login_data = login_response.json()
                    self.user_id = login_data['results']['id']
                    self.token = login_data['access_token']
                    print(f"Existing user logged in successfully. User ID: {self.user_id}")
                    return True
                else:
                    print("Failed to login existing user")
                    return False
            else:
                print("Signup failed")
                return False
        except Exception as e:
            print(f"Error during signup: {e}")
            return False
    
    def test_login(self):
        self.print_test_header("User Login")
        try:
            login_data = {
                "email": test_user["email"],
                "password": test_user["password"]
            }
            response = requests.post(f"{BASE_URL}/login", json=login_data)
            self.print_response(response)
            if response.status_code == 200:
                data = response.json()
                self.token = data['access_token']
                self.user_id = data['results']['id']
                print(f"Login successful. Token: {self.token[:20]}...")
                return True
            else:
                print("Login failed")
                return False
        except Exception as e:
            print(f"Error during login: {e}")
            return False
    
    def test_get_user(self):
        self.print_test_header("Get User Profile")
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{BASE_URL}/users/{self.user_id}", headers=headers)
            self.print_response(response)
            if response.status_code == 200:
                print("User profile retrieved successfully")
                return True
            else:
                print("Failed to get user profile")
                return False
        except Exception as e:
            print(f"Error getting user profile: {e}")
            return False
    
    def test_update_user(self):
        self.print_test_header("Update User Profile")
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            update_data = {
                "name": "Updated Test User",
                "profesional_title": "Senior Software Engineer"
            }
            response = requests.put(f"{BASE_URL}/users/{self.user_id}", 
                                  json=update_data, headers=headers)
            self.print_response(response)
            if response.status_code == 200:
                print("User profile updated successfully")
                return True
            else:
                print("Failed to update user profile")
                return False
        except Exception as e:
            print(f"Error updating user profile: {e}")
            return False
    
    def test_create_job(self):
        self.print_test_header("Create Job")
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.post(f"{BASE_URL}/jobs", json=test_job, headers=headers)
            self.print_response(response)
            if response.status_code == 201:
                data = response.json()
                self.job_id = data['results']['id']
                print(f"Job created successfully. Job ID: {self.job_id}")
                return True
            else:
                print("Failed to create job")
                return False
        except Exception as e:
            print(f"Error creating job: {e}")
            return False
    
    def test_get_jobs(self):
        self.print_test_header("Get All Jobs")
        try:
            response = requests.get(f"{BASE_URL}/jobs")
            self.print_response(response)
            if response.status_code == 200:
                print("Jobs retrieved successfully")
                return True
            else:
                print("Failed to get jobs")
                return False
        except Exception as e:
            print(f"Error getting jobs: {e}")
            return False
    
    def test_get_job_detail(self):
        self.print_test_header("Get Job Detail")
        try:
            response = requests.get(f"{BASE_URL}/jobs/{self.job_id}")
            self.print_response(response)
            if response.status_code == 200:
                print("Job detail retrieved successfully")
                return True
            else:
                print("Failed to get job detail")
                return False
        except Exception as e:
            print(f"Error getting job detail: {e}")
            return False
    
    def test_create_cv(self):
        self.print_test_header("Create CV")
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            test_cv["user_id"] = self.user_id
            response = requests.post(f"{BASE_URL}/cv", json=test_cv, headers=headers)
            self.print_response(response)
            if response.status_code == 201:
                data = response.json()
                self.cv_id = data['results']['id']
                print(f"CV created successfully. CV ID: {self.cv_id}")
                return True
            else:
                print("Failed to create CV")
                return False
        except Exception as e:
            print(f"Error creating CV: {e}")
            return False
    
    def test_get_user_cvs(self):
        self.print_test_header("Get User CVs")
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{BASE_URL}/users/{self.user_id}/cvs", headers=headers)
            self.print_response(response)
            if response.status_code == 200:
                print("User CVs retrieved successfully")
                return True
            else:
                print("Failed to get user CVs")
                return False
        except Exception as e:
            print(f"Error getting user CVs: {e}")
            return False
    
    def test_create_postulation(self):
        self.print_test_header("Create Postulation")
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            postulation_data = {
                "user_id": self.user_id,
                "job_id": self.job_id,
                "cv_id": self.cv_id,
                "name": "Application for Senior Software Engineer",
                "status": "Applied"
            }
            response = requests.post(f"{BASE_URL}/postulations", 
                                   json=postulation_data, headers=headers)
            self.print_response(response)
            if response.status_code == 201:
                data = response.json()
                self.postulation_id = data['results']['id']
                print(f"Postulation created successfully. Postulation ID: {self.postulation_id}")
                return True
            else:
                print("Failed to create postulation")
                return False
        except Exception as e:
            print(f"Error creating postulation: {e}")
            return False
    
    def test_get_user_postulations(self):
        self.print_test_header("Get User Postulations")
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{BASE_URL}/users/{self.user_id}/postulations", headers=headers)
            self.print_response(response)
            if response.status_code == 200:
                print("User postulations retrieved successfully")
                return True
            else:
                print("Failed to get user postulations")
                return False
        except Exception as e:
            print(f"Error getting user postulations: {e}")
            return False
    
    def test_update_postulation_status(self):
        self.print_test_header("Update Postulation Status")
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            update_data = {
                "status": "Interviewing",
                "interview_date": "2024-01-30T14:00:00Z"
            }
            response = requests.patch(f"{BASE_URL}/postulations/{self.postulation_id}/status", 
                                    json=update_data, headers=headers)
            self.print_response(response)
            if response.status_code == 200:
                print("Postulation status updated successfully")
                return True
            else:
                print("Failed to update postulation status")
                return False
        except Exception as e:
            print(f"Error updating postulation status: {e}")
            return False
    
    def test_protected_endpoint(self):
        self.print_test_header("Test Protected Endpoint")
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{BASE_URL}/protected", headers=headers)
            self.print_response(response)
            if response.status_code == 200:
                print("Protected endpoint accessed successfully")
                return True
            else:
                print("Failed to access protected endpoint")
                return False
        except Exception as e:
            print(f"Error accessing protected endpoint: {e}")
            return False
    
    def test_hello_endpoint(self):
        self.print_test_header("Test Hello Endpoint")
        try:
            response = requests.get(f"{BASE_URL}/hello")
            self.print_response(response)
            if response.status_code == 200:
                print("Hello endpoint working")
                return True
            else:
                print("Hello endpoint failed")
                return False
        except Exception as e:
            print(f"Error with hello endpoint: {e}")
            return False
    
    def test_login_invalid_credentials(self):
        self.print_test_header("Login with Invalid Credentials - 401")
        try:
            # Test with wrong password
            login_data = {
                "email": test_user["email"],
                "password": "wrongpassword"
            }
            response = requests.post(f"{BASE_URL}/login", json=login_data)
            self.print_response(response)
            if response.status_code == 401:
                print("Invalid credentials correctly rejected with 401")
                return True
            else:
                print("Expected 401 for invalid credentials")
                return False
        except Exception as e:
            print(f"Error testing invalid login: {e}")
            return False
    
    def test_login_nonexistent_user(self):
        self.print_test_header("Login with Non-existent User - 401")
        try:
            # Test with non-existent user
            login_data = {
                "email": "nonexistent@example.com",
                "password": "password123"
            }
            response = requests.post(f"{BASE_URL}/login", json=login_data)
            self.print_response(response)
            if response.status_code == 401:
                print("Non-existent user correctly rejected with 401")
                return True
            else:
                print("Expected 401 for non-existent user")
                return False
        except Exception as e:
            print(f"Error testing non-existent user login: {e}")
            return False
    
    def test_get_user_without_token(self):
        self.print_test_header("Get User without Token - 401")
        try:
            # Try to access user profile without authorization token
            response = requests.get(f"{BASE_URL}/users/1")
            self.print_response(response)
            if response.status_code == 401:
                print("User profile access correctly rejected without token")
                return True
            else:
                print("Expected 401 for unauthorized access")
                return False
        except Exception as e:
            print(f"Error testing unauthorized user access: {e}")
            return False
    
    def test_get_user_wrong_token(self):
        self.print_test_header("Get User with Wrong Token - 403")
        try:
            # Use existing user if available, otherwise create with unique email
            if self.token and self.user_id:
                token = self.token
                user_id = self.user_id
            else:
                # Create with unique email to avoid conflicts
                unique_user = test_user.copy()
                unique_user["email"] = "wrongtoken@example.com"
                signup_response = requests.post(f"{BASE_URL}/signup", json=unique_user)
                if signup_response.status_code == 201:
                    data = signup_response.json()
                    token = data['access_token']
                    user_id = data['results']['id']
                else:
                    print("Failed to create test user")
                    return False
            
            # Try to access different user's profile
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(f"{BASE_URL}/users/{user_id + 999}", headers=headers)
            self.print_response(response)
            if response.status_code == 403:
                print("Cross-user access correctly rejected with 403")
                return True
            else:
                print("Expected 403 for cross-user access")
                return False
        except Exception as e:
            print(f"Error testing cross-user access: {e}")
            return False
    
    def test_get_nonexistent_job(self):
        self.print_test_header("Get Non-existent Job - 404")
        try:
            # Try to access a job that doesn't exist
            response = requests.get(f"{BASE_URL}/jobs/99999")
            self.print_response(response)
            if response.status_code == 404:
                print("Non-existent job correctly returned 404")
                return True
            else:
                print("Expected 404 for non-existent job")
                return False
        except Exception as e:
            print(f"Error testing non-existent job: {e}")
            return False
    
    def test_create_postulation_missing_fields(self):
        self.print_test_header("Create Postulation with Missing Fields - 400")
        try:
            # Use existing user if available, otherwise create with unique email
            if self.token and self.user_id:
                token = self.token
                user_id = self.user_id
            else:
                # Create with unique email to avoid conflicts
                unique_user = test_user.copy()
                unique_user["email"] = "missingfields@example.com"
                signup_response = requests.post(f"{BASE_URL}/signup", json=unique_user)
                if signup_response.status_code == 201:
                    data = signup_response.json()
                    token = data['access_token']
                    user_id = data['results']['id']
                else:
                    print("Failed to create test user")
                    return False
            
            # Try to create postulation with missing required fields
            headers = {"Authorization": f"Bearer {token}"}
            postulation_data = {
                "user_id": user_id,
                # Missing job_id and cv_id
                "name": "Incomplete Application"
            }
            response = requests.post(f"{BASE_URL}/postulations",
                                   json=postulation_data, headers=headers)
            self.print_response(response)
            if response.status_code == 400:
                print("Postulation with missing fields correctly rejected with 400")
                return True
            else:
                print("Expected 400 for missing required fields")
                return False
        except Exception as e:
            print(f"Error testing postulation with missing fields: {e}")
            return False
    
    def test_access_other_user_cvs(self):
        self.print_test_header("Access Other User's CVs - 403")
        try:
            # Generate unique timestamp for emails
            timestamp = str(int(time.time()))
            
            # Create first user with unique email
            user1_data = {
                "email": f"user1_cvs_{timestamp}@example.com",
                "password": "password123",
                "name": "User One"
            }
            signup1_response = requests.post(f"{BASE_URL}/signup", json=user1_data)
            if signup1_response.status_code == 201:
                data1 = signup1_response.json()
                token1 = data1['access_token']
                user1_id = data1['results']['id']
                
                # Create second user with unique email
                user2_data = {
                    "email": f"user2_cvs_{timestamp}@example.com",
                    "password": "password123",
                    "name": "User Two"
                }
                signup2_response = requests.post(f"{BASE_URL}/signup", json=user2_data)
                if signup2_response.status_code == 201:
                    data2 = signup2_response.json()
                    user2_id = data2['results']['id']
                    
                    # Try to access user2's CVs with user1's token
                    headers = {"Authorization": f"Bearer {token1}"}
                    response = requests.get(f"{BASE_URL}/users/{user2_id}/cvs", headers=headers)
                    self.print_response(response)
                    if response.status_code == 403:
                        print("Cross-user CV access correctly rejected with 403")
                        return True
                    else:
                        print("Expected 403 for cross-user CV access")
                        return False
                else:
                    print("Failed to create second user")
                    return False
            else:
                print("Failed to create first user")
                return False
        except Exception as e:
            print(f"Error testing cross-user CV access: {e}")
            return False
    
    def test_access_other_user_postulations(self):
        self.print_test_header("Access Other User's Postulations - 403")
        try:
            # Generate unique timestamp for emails
            timestamp = str(int(time.time()))
            
            # Create first user with unique email
            user1_data = {
                "email": f"user1_post_{timestamp}@example.com",
                "password": "password123",
                "name": "User One"
            }
            signup1_response = requests.post(f"{BASE_URL}/signup", json=user1_data)
            if signup1_response.status_code == 201:
                data1 = signup1_response.json()
                token1 = data1['access_token']
                user1_id = data1['results']['id']
                
                # Create second user with unique email
                user2_data = {
                    "email": f"user2_post_{timestamp}@example.com",
                    "password": "password123",
                    "name": "User Two"
                }
                signup2_response = requests.post(f"{BASE_URL}/signup", json=user2_data)
                if signup2_response.status_code == 201:
                    data2 = signup2_response.json()
                    user2_id = data2['results']['id']
                    
                    # Try to access user2's postulations with user1's token
                    headers = {"Authorization": f"Bearer {token1}"}
                    response = requests.get(f"{BASE_URL}/users/{user2_id}/postulations", headers=headers)
                    self.print_response(response)
                    if response.status_code == 403:
                        print("Cross-user postulations access correctly rejected with 403")
                        return True
                    else:
                        print("Expected 403 for cross-user postulations access")
                        return False
                else:
                    print("Failed to create second user")
                    return False
            else:
                print("Failed to create first user")
                return False
        except Exception as e:
            print(f"Error testing cross-user postulations access: {e}")
            return False
    
    def test_create_postulation_for_other_user(self):
        self.print_test_header("Create Postulation for Other User - 403")
        try:
            # Use existing user if available, otherwise create with unique email
            if self.token and self.user_id:
                token = self.token
                user_id = self.user_id
            else:
                # Create with unique email to avoid conflicts
                unique_user = test_user.copy()
                unique_user["email"] = "otheruser_post@example.com"
                signup_response = requests.post(f"{BASE_URL}/signup", json=unique_user)
                if signup_response.status_code == 201:
                    data = signup_response.json()
                    token = data['access_token']
                    user_id = data['results']['id']
                else:
                    print("Failed to create test user")
                    return False
            
            # Create a job
            headers = {"Authorization": f"Bearer {token}"}
            job_response = requests.post(f"{BASE_URL}/jobs", json=test_job, headers=headers)
            if job_response.status_code == 201:
                job_data = job_response.json()
                job_id = job_data['results']['id']
                
                # Create a CV
                test_cv_copy = test_cv.copy()
                test_cv_copy["user_id"] = user_id
                cv_response = requests.post(f"{BASE_URL}/cv", json=test_cv_copy, headers=headers)
                if cv_response.status_code == 201:
                    cv_data = cv_response.json()
                    cv_id = cv_data['results']['id']
                    
                    # Try to create postulation for different user
                    postulation_data = {
                        "user_id": user_id + 999,  # Different user ID
                        "job_id": job_id,
                        "cv_id": cv_id,
                        "name": "Unauthorized Application"
                    }
                    response = requests.post(f"{BASE_URL}/postulations",
                                           json=postulation_data, headers=headers)
                    self.print_response(response)
                    if response.status_code == 403:
                        print("Postulation for other user correctly rejected with 403")
                        return True
                    else:
                        print("Expected 403 for postulation for other user")
                        return False
                else:
                    print("Failed to create CV")
                    return False
            else:
                print("Failed to create job")
                return False
        except Exception as e:
            print(f"Error testing postulation for other user: {e}")
            return False
    
    def cleanup_postulation(self):
        """Delete the test postulation if it exists"""
        if self.postulation_id:
            try:
                headers = {"Authorization": f"Bearer {self.token}"}
                response = requests.delete(f"{BASE_URL}/postulations/{self.postulation_id}", headers=headers)
                if response.status_code == 200:
                    print(f"Postulation {self.postulation_id} deleted successfully")
                else:
                    print(f"Failed to delete postulation {self.postulation_id}: {response.status_code}")
                self.postulation_id = None
            except Exception as e:
                print(f"Error deleting postulation: {e}")
    
    def cleanup_cv(self):
        """Delete the test CV if it exists"""
        if self.cv_id:
            try:
                headers = {"Authorization": f"Bearer {self.token}"}
                response = requests.delete(f"{BASE_URL}/cv/{self.cv_id}", headers=headers)
                if response.status_code == 200:
                    print(f"CV {self.cv_id} deleted successfully")
                else:
                    print(f"Failed to delete CV {self.cv_id}: {response.status_code}")
                self.cv_id = None
            except Exception as e:
                print(f"Error deleting CV: {e}")
    
    def cleanup_job(self):
        """Delete the test job if it exists"""
        if self.job_id:
            try:
                headers = {"Authorization": f"Bearer {self.token}"}
                response = requests.delete(f"{BASE_URL}/jobs/{self.job_id}", headers=headers)
                if response.status_code == 200:
                    print(f"Job {self.job_id} deleted successfully")
                else:
                    print(f"Failed to delete job {self.job_id}: {response.status_code}")
                self.job_id = None
            except Exception as e:
                print(f"Error deleting job: {e}")
    
    def cleanup_user(self):
        """Delete the test user if it exists"""
        if self.user_id and self.token:
            try:
                headers = {"Authorization": f"Bearer {self.token}"}
                response = requests.delete(f"{BASE_URL}/users/{self.user_id}", headers=headers)
                if response.status_code == 200:
                    print(f"User {self.user_id} deleted successfully")
                else:
                    print(f"Failed to delete user {self.user_id}: {response.status_code}")
                self.user_id = None
                self.token = None
            except Exception as e:
                print(f"Error deleting user: {e}")
    
    def cleanup_all(self):
        """Clean up all test data in reverse order of dependencies"""
        print("\n" + "="*60)
        print("CLEANING UP TEST DATA")
        print("="*60)
        
        # Clean up in reverse order of dependencies
        self.cleanup_postulation()
        self.cleanup_cv()
        self.cleanup_job()
        self.cleanup_user()
        
        print("Cleanup completed")
    
    def run_all_tests(self):
        print("Starting API Tests...")
        print(f"Base URL: {BASE_URL}")
        
        tests = [
            ("Hello Endpoint", self.test_hello_endpoint),
            ("User Signup", self.test_signup),
            ("User Login", self.test_login),
            ("Get User Profile", self.test_get_user),
            ("Update User Profile", self.test_update_user),
            ("Create Job", self.test_create_job),
            ("Get All Jobs", self.test_get_jobs),
            ("Get Job Detail", self.test_get_job_detail),
            ("Create CV", self.test_create_cv),
            ("Get User CVs", self.test_get_user_cvs),
            ("Create Postulation", self.test_create_postulation),
            ("Get User Postulations", self.test_get_user_postulations),
            ("Update Postulation Status", self.test_update_postulation_status),
            ("Protected Endpoint", self.test_protected_endpoint),
            # Negative path tests
            ("Login Invalid Credentials - 401", self.test_login_invalid_credentials),
            ("Login Non-existent User - 401", self.test_login_nonexistent_user),
            ("Get User without Token - 401", self.test_get_user_without_token),
            ("Get User with Wrong Token - 403", self.test_get_user_wrong_token),
            ("Get Non-existent Job - 404", self.test_get_nonexistent_job),
            ("Create Postulation Missing Fields - 400", self.test_create_postulation_missing_fields),
            ("Access Other User's CVs - 403", self.test_access_other_user_cvs),
            ("Access Other User's Postulations - 403", self.test_access_other_user_postulations),
            ("Create Postulation for Other User - 403", self.test_create_postulation_for_other_user)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
                else:
                    print(f"{test_name} failed")
            except Exception as e:
                print(f"{test_name} failed with exception: {e}")
        
        # Clean up test data after all tests
        self.cleanup_all()
        
        print(f"\n{'='*60}")
        print(f"TEST RESULTS: {passed}/{total} tests passed")
        print(f"{'='*60}")
        
        if passed == total:
            print("All tests passed!")
            return True
        else:
            print(f"{total - passed} tests failed")
            return False


if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)