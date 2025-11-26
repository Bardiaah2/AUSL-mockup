#1) make a funciton that reads the CSV file
    #- the info passed to the function is the name of the name of file, player name (row), stats (column)
#2) use this file to read the csv files passed in 
#3) call this function to read the data to the mongo db_sever

#uploaded all data to mango 


mvp_values = {"mvp1": 60, "mvp2": 40, "mvp3": 20, "defensive_mvp": 20}


import pandas as pd
# this function for debugging 
def csv_reader(file, name, stat):
    data = pd.read_csv(file)
    row_number = data.index[["Athlete"] == "name"][0] 
    value = data.loc[row_number, "stat"]
    return(value)






