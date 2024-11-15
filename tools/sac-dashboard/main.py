import calendar
import json
import streamlit as st
import pandas as pd
from datetime import datetime
from dotenv import dotenv_values


config = dotenv_values(".env")  # config = {"USER": "foo", "EMAIL": "foo@example.org"}

def read_sac_file(sac_file_path: str) -> list[dict]:
    data = {}
    with open(sac_file_path) as f:
        data: dict = json.load(f)
        data = data["reclamacoes"]
        
    sac_list = []
    for key in data.keys():
        for sac_data in data[key]["reclamacoes"]:
            date = datetime.strptime(sac_data["date"], '%d/%m/%Y, %H:%M:%S')
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


data = read_sac_file(config["SAC_FILE_PATH"])
df = build_df(data)
st.write(df)

keys = set(list(map(lambda sac: sac["name"], data)))
selected_name = st.selectbox(
    "Selecione uma pessoa para consultar:",
    keys,
)
df = df[df["name"] == selected_name]
df = df.groupby(['datetime_month_number', 'datetime_month_abbr']).size().to_frame('sacs')
st.bar_chart(df)

