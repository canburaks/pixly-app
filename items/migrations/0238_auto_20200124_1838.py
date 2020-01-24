# Generated by Django 2.0.5 on 2020-01-24 15:38

import ckeditor.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0237_auto_20200124_1759'),
    ]

    operations = [
        migrations.CreateModel(
            name='MovieGroupItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, help_text='Name', max_length=80, null=True)),
                ('html_content', ckeditor.fields.RichTextField(blank=True, help_text='Detailed description', max_length=1000, null=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='moviegroup',
            name='movies',
        ),
        migrations.RemoveField(
            model_name='moviegroup',
            name='topics',
        ),
        migrations.AddField(
            model_name='moviegroupitem',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='items.MovieGroup'),
        ),
        migrations.AddField(
            model_name='moviegroupitem',
            name='movie',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='group_items', to='items.Movie'),
        ),
    ]