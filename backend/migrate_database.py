"""
Database Migration Script
Migrates data from tasks.db (old schema with 'completed') to taskmanager.db (new schema with 'done')
"""

import sqlite3
import os

# Paths
OLD_DB = 'tasks.db'
NEW_DB = 'taskmanager.db'
BACKUP_DB = 'tasks.db.backup'

def migrate():
    print("=" * 60)
    print("DATABASE MIGRATION SCRIPT")
    print("=" * 60)
    
    # Check if old database exists
    if not os.path.exists(OLD_DB):
        print(f"❌ Old database '{OLD_DB}' not found. Nothing to migrate.")
        return
    
    # Backup old database
    print(f"\n1. Creating backup: {BACKUP_DB}")
    import shutil
    shutil.copy2(OLD_DB, BACKUP_DB)
    print(f"   ✅ Backup created successfully")
    
    # Connect to both databases
    print(f"\n2. Connecting to databases...")
    old_conn = sqlite3.connect(OLD_DB)
    new_conn = sqlite3.connect(NEW_DB)
    
    old_cursor = old_conn.cursor()
    new_cursor = new_conn.cursor()
    
    # Read data from old database
    print(f"\n3. Reading tasks from {OLD_DB}...")
    old_cursor.execute('SELECT id, title, description, completed FROM tasks')
    old_tasks = old_cursor.fetchall()
    print(f"   Found {len(old_tasks)} tasks to migrate")
    
    # Check if new database has the tasks table
    new_cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'")
    if not new_cursor.fetchone():
        print(f"\n   ⚠️  Tasks table doesn't exist in {NEW_DB}. It will be created by the FastAPI app on startup.")
        print(f"   ℹ️  Start the backend first, then run this migration script again.")
        old_conn.close()
        new_conn.close()
        return
    
    # Get schema info
    new_cursor.execute('PRAGMA table_info(tasks)')
    new_schema = new_cursor.fetchall()
    print(f"\n   New schema fields: {[col[1] for col in new_schema]}")
    
    # Migrate data
    print(f"\n4. Migrating tasks to {NEW_DB}...")
    migrated_count = 0
    skipped_count = 0
    
    for task_id, title, description, completed in old_tasks:
        # Check if task already exists
        new_cursor.execute('SELECT id FROM tasks WHERE id = ?', (task_id,))
        if new_cursor.fetchone():
            print(f"   ⚠️  Task ID {task_id} already exists in new database. Skipping.")
            skipped_count += 1
            continue
        
        # Insert into new database with 'done' field instead of 'completed'
        try:
            from datetime import datetime
            created_at = datetime.utcnow().isoformat()
            new_cursor.execute(
                'INSERT INTO tasks (id, title, description, done, created_at) VALUES (?, ?, ?, ?, ?)',
                (task_id, title, description, completed, created_at)
            )
            migrated_count += 1
            print(f"   ✅ Migrated: ID={task_id}, title='{title}', done={bool(completed)}")
        except Exception as e:
            print(f"   ❌ Error migrating task ID {task_id}: {e}")
    
    # Commit changes
    new_conn.commit()
    print(f"\n5. Migration complete!")
    print(f"   Migrated: {migrated_count} tasks")
    print(f"   Skipped: {skipped_count} tasks (already existed)")
    
    # Close connections
    old_conn.close()
    new_conn.close()
    
    # Rename old database
    if migrated_count > 0:
        print(f"\n6. Renaming old database...")
        if os.path.exists(f"{OLD_DB}.old"):
            os.remove(f"{OLD_DB}.old")
        os.rename(OLD_DB, f"{OLD_DB}.old")
        print(f"   ✅ Old database renamed to {OLD_DB}.old")
        print(f"   ℹ️  You can delete {OLD_DB}.old and {BACKUP_DB} after verifying the migration.")
    
    print("\n" + "=" * 60)
    print("✅ MIGRATION SUCCESSFUL!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Restart the backend server (if running)")
    print("2. Test the application to verify all tasks are present")
    print("3. If everything works, delete tasks.db.old and tasks.db.backup")

if __name__ == "__main__":
    try:
        migrate()
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        print("\nPlease check the error and try again.")
