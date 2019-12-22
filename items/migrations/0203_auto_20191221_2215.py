# Generated by Django 2.0.5 on 2019-12-21 19:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('persons', '0104_auto_20191116_1622'),
        ('items', '0202_auto_20191221_1221'),
    ]

    operations = [
        migrations.CreateModel(
            name='Award',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('award', models.CharField(choices=[('best_picture', 'Best Picture'), ('best_director', 'Best Director'), ('best_actor', 'Best Actor'), ('best_actress', 'Best Actress'), ('supporting_actor', 'Best Actor in Supporting Role'), ('supporting_actress', 'Best Actress in Supporting Role'), ('best_cinematography', 'Best Cinematography'), ('best_animated', 'Best Animated Feature Film'), ('best_international', 'Best International Film'), ('best_visual_effects', 'Best International Film'), ('best_original_song', 'Best International Film'), ('best_adapted_screenplay', 'Best Adapted Screenplay'), ('best_original_screenplay', 'Best Original Screenplay'), ('golden_palm', 'Cannes Film Festival - Golden Palm'), ('golden_bear', 'Berlin Film Festival - Golden Bear'), ('golden_lion', 'Venice Film Festival - Golden Lion')], max_length=25, null=True)),
                ('year', models.IntegerField()),
                ('note', models.TextField(blank=True, max_length=500, null=True)),
                ('movie', models.ForeignKey(help_text="winner of the award's movie.", on_delete=django.db.models.deletion.CASCADE, related_name='oscars_won', to='items.Movie')),
                ('movies', models.ManyToManyField(blank=True, help_text='Nominees. If the award is personal set movies that the person play in.', null=True, related_name='oscars', to='items.Movie')),
                ('person', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='oscars_won', to='persons.Person')),
                ('persons', models.ManyToManyField(blank=True, null=True, related_name='oscars', to='persons.Person')),
            ],
        ),
        migrations.RemoveField(
            model_name='oscar',
            name='movie',
        ),
        migrations.RemoveField(
            model_name='oscar',
            name='movies',
        ),
        migrations.RemoveField(
            model_name='oscar',
            name='person',
        ),
        migrations.RemoveField(
            model_name='oscar',
            name='persons',
        ),
        migrations.DeleteModel(
            name='Oscar',
        ),
    ]