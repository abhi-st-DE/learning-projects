import pandas as pd
import requests
from bs4 import BeautifulSoup

URL = "https://realpython.github.io/fake-jobs/"
page = requests.get(URL)

soup = BeautifulSoup(page.content, "html.parser")

results = soup.find(id="ResultsContainer")
# print(results.prettify())


'''
# this approach is a very hard coded approach and won't work if you don't know the exact job type.

    job_cards = results.find_all("div", class_="card-content")
    for job_card in job_cards:
        title_element = job_card.find("h2", class_="title")
        company_element = job_card.find("h3", class_="company")
        location_element = job_card.find("p", class_="location")
        post_date_element = job_card.find("p", class_="is-small has-text-grey")
        if "Software Developer" in title_element.text.strip():
            print(f'Job Title: {title_element.text.strip()}')
            print(f'Company Name: {company_element.text.strip()}')
            print(f'Location: {location_element.text.strip()}')
            print(f'Post Date: {post_date_element.text.strip()}')
            print()
        else:
            continue

'''

python_jobs = results.find_all(
    "h2", string=lambda text: "python" in text.lower()
)
# print(len(python_jobs))

python_job_cards = [
    h2_element.parent.parent.parent for h2_element in python_jobs
]

df = pd.DataFrame(
    {
    "Job Title": [job_card.find("h2", class_="title").text.strip() for job_card in python_job_cards],
    "Company Name": [job_card.find("h3", class_="company").text.strip() for job_card in python_job_cards],
    "Location": [job_card.find("p", class_="location").text.strip() for job_card in python_job_cards],
    "Post Date": [job_card.find("p", class_="is-small has-text-grey").text.strip() for job_card in python_job_cards],
    "Apply Here": [job_card.find_all("a")[1]["href"].strip() for job_card in python_job_cards]
    }
)

df.to_csv('output.csv', index=False)  # Export the DataFrame to a CSV file

print(df)

'''
for job_card in python_job_cards:
    link_url =  job_card.find_all("a")[1]["href"]
    title_element = job_card.find("h2", class_="title")
    company_element = job_card.find("h3", class_="company")
    location_element = job_card.find("p", class_="location")
    print(f'Job Title: {title_element.text.strip()}')
    print(f'Company Name: {company_element.text.strip()}')
    print(f'Location: {location_element.text.strip()}')
    print(f'Apply Here: {link_url}\n')

'''