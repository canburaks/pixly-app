# Generated by Django 2.0.5 on 2019-12-21 19:27

import ckeditor.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0205_movie_topic_poster'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movie',
            name='special_summary',
        ),
        migrations.AddField(
            model_name='movie',
            name='html_content',
            field=ckeditor.fields.RichTextField(blank=True, help_text='For Feature Movies that will show on Topic Page.', max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name='topic',
            name='feature_movies',
            field=models.ManyToManyField(blank=True, help_text='For starring movies that will show on top of the page.', null=True, related_name='feature_topics', to='items.Movie'),
        ),
    ]
