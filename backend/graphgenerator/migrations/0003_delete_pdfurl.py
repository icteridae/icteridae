# Generated by Django 3.1.1 on 2021-01-13 23:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('graphgenerator', '0002_paper_pdfurl'),
    ]

    operations = [
        migrations.DeleteModel(
            name='PdfUrl',
        ),
    ]
