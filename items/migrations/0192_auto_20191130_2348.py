# Generated by Django 2.0.5 on 2019-11-30 20:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0191_list_content'),
    ]

    operations = [
        migrations.AlterField(
            model_name='list',
            name='list_type',
            field=models.CharField(blank=True, choices=[('df', "Director's Favourite"), ('fw', 'Festival Winner Movies'), ('gr', 'Genre Related'), ('ms', 'Miscellaneous'), ('mm', 'Movies of the Month')], help_text="What is the relation about the list and person? E.g; 'Directors favourite movie list'", max_length=3, null=True),
        ),
    ]
