# Generated by Django 2.0.5 on 2019-05-22 18:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('persons', '0058_activity'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='activity',
            name='event',
        ),
        migrations.AddField(
            model_name='activity',
            name='action',
            field=models.CharField(choices=[('rm', 'rating'), ('bm', 'bookmark'), ('lm', 'like'), ('fp', 'follow-person'), ('fu', 'follow-user'), ('fl', 'follow-list')], max_length=2, null=True),
        ),
    ]
