import re
import streamlit as st
import numpy as np
from PIL import Image
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from nltk.corpus import stopwords


def plot_wordcloud(text: str):

    text = re.sub('\s+(a|e|o|de|da|do|dele|sem|pra|para|só|so)(\s+)', '\2', text)
    wc = WordCloud(background_color='white', colormap='binary', stopwords=['meta'], width=800, height=500).generate(text)
    # fig, ax = plt.subplots()
    # fig.ims
    plt.imshow(wc, interpolation="bilinear")
    plt.axis("off")
    plt.show()
    st.pyplot()