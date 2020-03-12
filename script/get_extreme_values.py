import csv

cols = ['Category1', 'Category2', 'Name', 'Size', 'Calories', 'Sugars (g)', 'Image']
new_cols = ['Category1', 'Category2', 'Name', 'Image', 'Size_Min', 'Calories_Min', 'Size_Max', 'Calories_Max']
indexes = {}
data = {}

with open('../data/starbucks-menu/drink_manual.csv') as read_file:
    readCSV = csv.reader(read_file, delimiter=',')
    i = 0
    for row in readCSV:
        if i == 0:
            for col in cols:
                indexes[col] = row.index(col)
            i += 1
        else:
            if row[indexes['Name']] not in data:
                data[row[indexes['Name']]] = {
                    'Category1': row[indexes['Category1']],
                    'Category2': row[indexes['Category2']],
                    'Name': row[indexes['Name']],
                    'Image': row[indexes['Image']],
                    'Size_Min': row[indexes['Size']],
                    'Calories_Min': row[indexes['Calories']],
                }
            else:
                # assume order from small to large
                data[row[indexes['Name']]]['Size_Max'] = row[indexes['Size']]
                data[row[indexes['Name']]]['Calories_Max'] = row[indexes['Calories']]

with open("../data/starbucks-menu/drink_manual_extreme_value.csv", "w") as write_file:
    li = ','.join(new_cols)
    write_file.write(li + '\n')
    print(li)
    for key in data:
        li = [data[key][col] for col in new_cols]
        li = ','.join(li)
        write_file.write(li + '\n')
        print(li)
