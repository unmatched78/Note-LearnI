from django.db import migrations

class Migration(migrations.Migration):

    # 👇 Change this line to depend on '0009_alter_studyevent_options_notes'
    dependencies = [
        ('core', '0009_alter_studyevent_options_notes'),
    ]

    operations = [
        migrations.RunSQL('CREATE EXTENSION IF NOT EXISTS pg_trgm;'),
    ]
