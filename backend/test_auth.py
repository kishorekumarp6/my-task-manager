from auth import MOCK_USERS, verify_password, create_access_token, authenticate_user

print('='*60)
print('Testing Mock Authentication System')
print('='*60)

print('\n1. Mock users loaded:', list(MOCK_USERS.keys()))

print('\n2. Testing authentication with correct credentials:')
user = authenticate_user('demo@example.com', 'password123')
if user:
    print('   ✓ Authentication SUCCESS')
    print(f'   User: {user["full_name"]} ({user["email"]})')
else:
    print('   ✗ Authentication FAILED')

print('\n3. Testing authentication with wrong password:')
user_wrong = authenticate_user('demo@example.com', 'wrongpassword')
if user_wrong:
    print('   ✗ Should have failed but succeeded')
else:
    print('   ✓ Correctly rejected wrong password')

print('\n4. Testing JWT token generation:')
if user:
    token = create_access_token({'sub': 'demo@example.com'})
    print(f'   Token generated: {token[:50]}...')
    print(f'   Token length: {len(token)} characters')

print('\n5. Testing admin user:')
admin = authenticate_user('admin@example.com', 'admin123')
if admin:
    print('   ✓ Admin authentication SUCCESS')
    print(f'   User: {admin["full_name"]} ({admin["email"]})')
else:
    print('   ✗ Admin authentication FAILED')

print('\n' + '='*60)
print('All authentication tests completed!')
print('='*60)
