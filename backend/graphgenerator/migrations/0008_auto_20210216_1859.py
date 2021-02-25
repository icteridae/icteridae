# Generated by Django 3.1.5 on 2021-02-16 18:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('graphgenerator', '0007_auto_20210212_1334'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='paper',
            name='authors',
        ),
        migrations.CreateModel(
            name='AuthorPaper',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='graphgenerator.author')),
                ('paper', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='graphgenerator.paper')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
    ]
