print('Testing FastAPI app import...')
from main import app

print('✓ FastAPI app imported successfully')
print(f'  Title: {app.title}')
print(f'  Version: {app.version}')
print('\n✓ Available routes:')

from fastapi.openapi.utils import get_openapi
openapi_schema = get_openapi(title=app.title, version=app.version, routes=app.routes)

for path, methods in openapi_schema['paths'].items():
    for method in methods.keys():
        if method != 'parameters':
            print(f'  {method.upper():6} {path}')

print('\n✓ FastAPI application ready to start!')
