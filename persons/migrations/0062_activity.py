# Generated by Django 2.0.5 on 2019-05-22 18:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('persons', '0061_auto_20190522_2145'),
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(choices=[('rm', 'rating'), ('bm', 'bookmark'), ('lm', 'like'), ('fp', 'follow-person'), ('fu', 'follow-user'), ('fl', 'follow-list')], max_length=2)),
                ('target_profile_username', models.CharField(blank=True, max_length=40, null=True)),
                ('movie_id', models.IntegerField(blank=True, null=True)),
                ('person_id', models.CharField(blank=True, max_length=19, null=True)),
                ('liste_id', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='activities', to='persons.Profile')),
            ],
        ),
    ]
