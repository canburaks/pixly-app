# Generated by Django 2.0.5 on 2018-11-09 15:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0034_auto_20181106_1934'),
    ]

    operations = [
        migrations.AlterField(
            model_name='list',
            name='movies',
            field=models.ManyToManyField(related_name='list', to='items.Movie'),
        ),
    ]
