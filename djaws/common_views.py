from django.shortcuts import render

def bad_request(request):
    context = {}
    return render(request, '400.html', context, status=400)


def permission_denied(request):
    context = {}
    return render(request, '403.html', context, status=403)




def server_error(request):
    context = {}
    return render(request, '500.html', context, status=500)