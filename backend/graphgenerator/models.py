from django.db import models

# Create your models here.

class Paper(models.Model): # Independant
    """
    Model for a single paper
    """

    id = models.CharField(max_length=40, primary_key=True)

    title = models.CharField(max_length=200) # TODO check max title length
    paperAbstract = models.TextField(blank=True)
    
    authors = models.ManyToManyField('Author')
    inCitations = models.ManyToManyField('self', symmetrical=False)
    # outCitations probably not needed?
    year = models.IntegerField(null=True)
    s2Url = models.URLField()
    # sources # TODO
    # venue # TODO
    # journalName # TODO
    # journalVolume # TODO
    # journalPages # TODO
    # doi # TODO
    doiUrl = models.URLField(null=True)
    # pmid # TODO
    fieldsOfStudy = models.ManyToManyField('FieldOfStudy')
    # magid # TODO
    # s2PdUrl # TODO
    # entities # TODO

class Author(models.Model): # Independant
    name = models.CharField(max_length=200) 
    id = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.name 

class FieldOfStudy(models.Model): # Independant
    field = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.field

class PdfUrl(models.Model): # Dependant on Paper
    url = models.URLField()
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE)

    def __str__(self):
        return self.url