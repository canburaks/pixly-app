# Generated by Django 2.0.5 on 2019-11-16 13:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0188_auto_20191116_1612'),
    ]

    operations = [
        migrations.AlterField(
            model_name='list',
            name='seo_title',
            field=models.CharField(blank=True, help_text='70 character limit. 65 is OK', max_length=70, null=True),
        ),
        migrations.AlterField(
            model_name='movie',
            name='seo_title',
            field=models.CharField(blank=True, help_text='70 character limit. 65 is OK', max_length=70, null=True),
        ),
        migrations.AlterField(
            model_name='tag',
            name='seo_title',
            field=models.CharField(blank=True, help_text='70 character limit. 65 is OK', max_length=70, null=True),
        ),
        migrations.AlterField(
            model_name='topic',
            name='seo_title',
            field=models.CharField(blank=True, help_text='70 character limit. 65 is OK', max_length=70, null=True),
        ),
    ]