import calendar
import json
import streamlit as st
import pandas as pd
from datetime import datetime
from dotenv import dotenv_values
from collections import Counter

from charts.word_cloud import plot_wordcloud


config = dotenv_values(".env")  # config = {"USER": "foo", "EMAIL": "foo@example.org"}


def parse_sac_datetime(datetime_string: str) -> datetime:
    return datetime.strptime(datetime_string, '%d/%m/%Y, %H:%M:%S')

def read_sac_file(sac_file_path: str) -> list[dict]:
    data = {}
    with open(sac_file_path, encoding="utf-8") as f:
        data: dict = json.load(f)
        data = data["reclamacoes"]
        
    sac_list = []
    for key in data.keys():
        for sac_data in data[key]["reclamacoes"]:
            date = parse_sac_datetime(sac_data["date"])
            username = sac_data["from"].get("username")
            sac_list.append({
                "name": key,
                "from_id": sac_data["from"]["id"],
                "from_name": username if username is not None else sac_data["from"].get("first_name"),
                "message": sac_data["message"],
                "datetime_str": sac_data["date"],
                "datetime_month_number": date.month,
                "datetime_month_string": calendar.month_name[date.month],
                "datetime_month_abbr":  calendar.month_abbr[date.month],
            })
    return sac_list


def build_df(data: list) -> pd.DataFrame:
    df = pd.DataFrame(data, columns=[
        "name", 
        "from_id", 
        "from_name", 
        "message", 
        "datetime_str",
        "datetime_month_number",
        "datetime_month_string",
        "datetime_month_abbr",])
    return df


def ranking(data: list) -> pd.DataFrame:
    names = [sac["name"] for sac in data]
    counts = Counter(names)
    ranking = []
    for n in set(names):
        dates = [sac["datetime_str"] for sac in data if sac["name"] == n]
        dates = [parse_sac_datetime(d) for d in dates]
        dates.sort()
        
        haters = [sac["from_name"] for sac in data if sac["name"] == n]
        haters = Counter(haters)
        ranking.append({
            "name": n,
            "count": counts[n],
            "hater": haters.most_common(1)[0][0],
            "last_sac": dates[-1].strftime("%d/%m/%Y, %H:%M")
        })
    df = pd.DataFrame(ranking, columns=["name", "count", "hater", "last_sac"])
    df = df.sort_values(by=["count", "last_sac"], ascending=[False, False])
    return df


def monthly(selected: str, df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df = df[df["name"] == selected_name]
    df = df.groupby(['datetime_month_number', 'datetime_month_abbr']).size().to_frame('sacs')
    return df


data = read_sac_file(config["SAC_FILE_PATH"])
df = build_df(data)

st.write("## Word Cloud")
st.write("#### Quais são as palavras mais usadas no SAC?")
plot_wordcloud(" ".join([sac["message"] for sac in data]))

st.write("## Raking")
st.write("#### Quem mais recebe reclamações no SAC?")
st.dataframe(ranking(data))

st.write("## Quantos SACs você recebeu por mês?")
keys = set(list(map(lambda sac: sac["name"], data)))
selected_name = st.selectbox(
    "Selecione uma pessoa para consultar:",
    keys,
)
# st.bar_chart(monthly(select_name, df))

st.write("## Raw data")
st.write(df)
st.write(data)
