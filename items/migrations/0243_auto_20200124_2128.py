# Generated by Django 2.0.5 on 2020-01-24 18:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0242_auto_20200124_2122'),
    ]

    operations = [
        migrations.AlterField(
            model_name='moviegroup',
            name='poster_type',
            field=models.CharField(choices=[('cover', 'Cover (Horizontal) Image'), ('poster', 'Vertical Poster')], default='cover', max_length=6),
        ),
    ]
