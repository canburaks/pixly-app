# Generated by Django 2.0.5 on 2018-12-05 22:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('persons', '0031_auto_20181205_2149'),
        ('items', '0063_auto_20181205_2218'),
    ]

    operations = [
        migrations.RenameField(
            model_name='movie',
            old_name='editor',
            new_name='editors',
        ),
        migrations.RemoveField(
            model_name='movie',
            name='photography',
        ),
        migrations.AddField(
            model_name='movie',
            name='dop',
            field=models.ForeignKey(blank=True, help_text='Director of  Photographer', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='cinema', to='persons.Person'),
        ),
    ]
