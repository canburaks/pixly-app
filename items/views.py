tis = TopicItem.objects.all().only("html_content")
topics = Topic.objects.all().only("html_content", "html_content2", "html_content3")



for ti in tqdm(topics):
    if ti.html_content:
        new_html = ti.html_content.replace("http://localhost:8080", "https://pixly.app")
        ti.html_content =  new_html
    if ti.html_content2:
        new_html = ti.html_content2.replace("http://localhost:8080", "https://pixly.app")
        ti.html_content2 =  new_html
    if ti.html_content3:
        new_html = ti.html_content3.replace("http://localhost:8080", "https://pixly.app")
        ti.html_content3 =  new_html
    ti.save()



for ti in tqdm(tis):
    if ti.html_content:
        new_html = ti.html_content.replace("http://localhost:8080", "https://pixly.app")
        ti.html_content =  new_html
        ti.save()