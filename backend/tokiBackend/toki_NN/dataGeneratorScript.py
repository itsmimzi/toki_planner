import pandas as pd
import numpy as np
from datetime import datetime, timedelta



def generate_cyclical_features(df, column, max_value):
    df[f'{column}_sin'] = np.sin(2 * np.pi * df[column] / max_value)
    df[f'{column}_cos'] = np.cos(2 * np.pi * df[column] / max_value)
    return df


# Set the seed for reproducibility and define number of samples
np.random.seed(42)
n_samples = 10000

task_types = ['meeting', 'workout', 'coding', 'personal', 'work']
days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
priorities = ['low', 'medium', 'high', 'ASAP']
start_hour = 7  # Starting at 7 AM
end_hour = 20   # Ending at 8 PM, for a typical workday range
workout_times = [datetime(2020, 1, 1, hour, minute) for hour, minute in [(7, 0), (7, 30), (8, 0), (9, 0), (12, 30), (13, 0), (18, 30), (19, 0), (19, 30)]]

# Generates task attributes
task_ids = list(range(1, n_samples + 1))
task_type_assignments = np.random.choice(task_types, n_samples)
isComplete = np.random.choice([True, False], n_samples, p=[0.9, 0.1])
durations = []
priorities_assignments = []
day_of_week_assignments = []
start_times = []
hasAddress = []
hasURL = []
hasDescription = []

for i in range(n_samples):
    type = task_type_assignments[i]
    if type == 'workout':
        durations.append(np.random.choice([1, 2, 3, 4], p=[0.2, 0.6, 0.1, 0.1]) * 30)
        priorities_assignments.append(np.random.choice(priorities, p=[0.5, 0, 0, 0.5]))
        day_of_week_assignments.append(np.random.choice(days_of_week, p=[0.3, 0.2, 0.3, 0.1, 0.1]))
        start_times.append(np.random.choice(workout_times).strftime('%H:%M'))
        hasAddress.append(np.random.choice([True, False], p=[0.1, 0.9]))
        hasURL.append(False)
        hasDescription.append(np.random.choice([True, False], p=[0.35, 0.65]))

    elif type == 'coding':
        durations.append(np.random.choice(range(2, 10)) * 30)
        priorities_assignments.append(np.random.choice(priorities, p=[0.05, 0.45, 0.2, 0.3]))
        day_of_week_assignments.append(np.random.choice(days_of_week, p=[0, 0.4, 0.4, 0.1, 0.1]))
        possible_times = [datetime(2020, 1, 1, hour, 0) for hour in range(7, 21)]
        start_times.append(np.random.choice(possible_times).strftime('%H:%M'))
        hasAddress.append(False)
        hasURL.append(np.random.choice([True, False], p=[0.1, 0.9]))
        hasDescription.append(np.random.choice([True, False], p=[0.7, 0.3]))

    elif type == 'meeting':
        durations.append(np.random.choice([15, 30, 45, 60, 90, 100, 120], p=[0.2, 0.2, 0.1, 0.2, 0.1, 0.1, 0.1]))
        priorities_assignments.append(np.random.choice(priorities, p=[0, 0.3, 0.1, 0.6]))
        day_of_week_assignments.append(np.random.choice(days_of_week, p=[0.6, 0, 0, 0.2, 0.2]))
        possible_times = [datetime(2020, 1, 1, hour, 0) for hour in range(9, 18)]
        start_times.append(np.random.choice(possible_times).strftime('%H:%M'))
        hasAddress.append(np.random.choice([True, False], p=[0.35,0.65]))
        hasURL.append(np.random.choice([True, False], p=[0.75, 0.25]))
        hasDescription.append(np.random.choice([True, False], p=[0.8, 0.2]))

    else :
        durations.append(np.random.choice(range(1, 5)) * 30)  # Durations in 30-minute blocks
        priorities_assignments.append(np.random.choice(priorities))
        day_of_week_assignments.append(np.random.choice(days_of_week, p=[0, 0, 0.3, 0, 0.7]))
        possible_times = [datetime(2020, 1, 1, hour, 0) for hour in range(7, 21)]
        start_times.append(np.random.choice(possible_times).strftime('%H:%M'))
        hasAddress.append(np.random.choice([True, False], p=[0.1, 0.9]))
        hasURL.append(np.random.choice([True, False], p=[0.1, 0.9]))
        hasDescription.append(np.random.choice([True, False], p=[0.9, 0.1]))

# initial dataframe
df = pd.DataFrame({
    'Task ID': task_ids,
    'Task Type': task_type_assignments,
    'Duration in min': durations,
    'Day of Week': day_of_week_assignments,
    'has Description' : hasDescription,
    'has Address': hasAddress,
    'has URL': hasURL,
    'Priority': priorities_assignments,
    'is Complete': isComplete,
    'Start Time': start_times
})

# Convert 'Start Time' to datetime
df['Start Time'] = pd.to_datetime(df['Start Time'], format='%H:%M')
df['End Time'] = None

# Calculate 'End Time' only for completed tasks
for i, row in df.iterrows():
    if row['is Complete']:
        end_time = row['Start Time'] + timedelta(minutes=row['Duration in min'])
        df.at[i, 'End Time'] = end_time

# Convert 'End Time' to datetime
df['End Time'] = pd.to_datetime(df['End Time'], format='%H:%M', errors='ignore')

# generates cyclical features for 'End Time' for completed tasks
df['hour_end'] = np.nan
df['minute_end'] = np.nan
# Populate 'hour_end' and 'minute_end' only for rows with valid 'End Time'
valid_end_time_indices = df[df['is Complete'] & df['End Time'].notnull()].index
df.loc[valid_end_time_indices, 'hour_end'] = df.loc[valid_end_time_indices, 'End Time'].dt.hour
df.loc[valid_end_time_indices, 'minute_end'] = df.loc[valid_end_time_indices, 'End Time'].dt.minute

# Extract hours and minutes for cyclical encoding
df['hour_start'] = df['Start Time'].dt.hour
df['minute_start'] = df['Start Time'].dt.minute
# Apply cyclical encoding
df = generate_cyclical_features(df, 'hour_start', 24)
df = generate_cyclical_features(df, 'minute_start', 60)

# Format time attributes to strings in the format 'HH:MM'
df['Start Time'] = df['Start Time'].dt.strftime('%H:%M')
df['End Time'] = df.loc[df['End Time'].notnull(), 'End Time'].dt.strftime('%H:%M')

# Display the head of the dataframe to verify
print(df.head())

# Optionally, save the enhanced dataset
df.to_csv('./synthetic_task_data_v2.csv', index=False)





