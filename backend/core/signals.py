from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, ResumeData


@receiver(post_save, sender=User)
def create_user_resume(sender, instance, created, **kwargs):
    """Create a ResumeData instance when a new User is created."""
    if created:
        ResumeData.objects.create(
            user=instance,
            title=f"{instance.first_name}'s Resume",
            summary="",
            experience="",
            education="",
            certifications=""
        ) 