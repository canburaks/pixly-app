# Generated by Django 2.0.5 on 2020-01-10 14:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0027_auto_20191123_1714'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='important_page',
            field=models.BooleanField(default=False, help_text='Selected item page can be allowed make dofollow links.'),
        ),
    ]