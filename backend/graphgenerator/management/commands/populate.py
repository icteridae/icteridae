from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from .store_papers import load

class Command(BaseCommand):
    help = 'Loads papers into database'

    def add_arguments(self, parser):
        parser.add_argument('-l', '--limit', type=int, help='Limit number of lines read from each file.')
        parser.add_argument('-b', '--batch', type=int, help='Number of papers per batch. Increase for faster runtime with more RAM usage.')
        parser.add_argument('-f', '--files', type=str, nargs='+', help='Files to process. Defaults to all.')
        parser.add_argument('-n', '--noelastic', action='store_true', help='Do not update elasticsearch. Can help with low memory.')

    def handle(self, *args, **options):
        load(options['limit'], options['batch'] if options['batch'] else 1000, options['verbosity'], options['files'])

        if not options['noelastic']: call_command('search_index', '--rebuild', '--parallel', '-f', '--verbosity', options['verbosity'])
        if options['verbosity'] > 1: self.stdout.write('Done populating.')