# Generated by Django 2.0.5 on 2019-04-15 21:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('archive', '0008_delete_movsim'),
    ]

    operations = [
        migrations.CreateModel(
            name='MovSim',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('base_id', models.IntegerField(default=0)),
                ('target_id', models.IntegerField(default=0)),
                ('users', models.IntegerField()),
                ('pearson', models.DecimalField(blank=True, decimal_places=3, max_digits=4, null=True)),
                ('acs', models.DecimalField(blank=True, decimal_places=3, max_digits=4, null=True)),
            ],
        ),
    ]
