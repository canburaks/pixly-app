# Generated by Django 2.0.5 on 2020-01-24 18:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0244_auto_20200124_2144'),
    ]

    operations = [
        migrations.AlterField(
            model_name='moviegroup',
            name='poster_type',
            field=models.CharField(choices=[('c', 'Cover (Horizontal) Image'), ('p', 'Vertical Poster')], default='cover', max_length=1),
        ),
    ]
