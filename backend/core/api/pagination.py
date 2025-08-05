# pagination.py
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5               # 20 items per page
    page_size_query_param = "page_size"
    max_page_size = 40
    page_query_param = "page"   # Query parameter for page number
    last_page_strings = ("last",)  # Allow 'last' as a query parameter