from django.db import models

# Create your models here.

class Paper(models.Model):
    """
    Model for a single paper
    """

    id = models.CharField(max_length=40, primary_key=True)

    title = models.CharField(max_length=200) # TODO check max title length
    paperAbstract = models.TextField()
    
    authors = models.ManyToManyField('Author')
    inCitations = models.ManyToManyField('self')
    # outCitations probably not needed?
    year = models.IntegerField()
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

class Author(models.Model):
    name = models.CharField(max_length=200) 

    def __str__(self):
        return self.name
class AuthorID(models.Model):
    id = models.IntegerField(primary_key=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)

    def __str__(self):
        return self.author.name + ', id: ' + str(self.id)
 

class FieldOfStudy(models.Model):
    field = models.CharField(max_length=100, primary_key=True)

    def __str__(self):
        return self.field


class PdfUrl(models.Model):
    url = models.URLField()
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE)

    def __str__(self):
        return url