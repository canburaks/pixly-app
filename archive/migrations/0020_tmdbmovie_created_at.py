# Generated by Django 2.0.5 on 2019-08-18 02:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('archive', '0019_auto_20190612_1917'),
    ]

    operations = [
        migrations.AddField(
            model_name='tmdbmovie',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
