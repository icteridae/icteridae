from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from .store_papers import load

class Command(BaseCommand):
    help = 'Loads papers into database'

    def add_arguments(self, parser):
        parser.add_argument('-l', '--limit', type=int, help='Limit number of lines read from each file.')
        parser.add_argument('-b', '--batch', type=int, help='Number of papers per batch. Increase for faster runtime with more RAM usage.')
        parser.add_argument('-f', '--files', type=str, nargs='+', help='Files to process. Defaults to all.')

    def handle(self, *args, **options):
        load(options['limit'], options['batch'] if options['batch'] else 1000, options['verbosity'], options['files'])

        call_command('search_index', '--rebuild', '-f', '--verbosity', options['verbosity'])
        if options['verbosity'] > 1: self.stdout.write('Done populating.')