import pandas as pd
from sklearn.model_selection import train_test_split
import numpy as np

# Load the dataset
# df = pd.read_csv('./synthetic_task_data_v2.csv')


def categorize_duration(duration):
    """Categorize duration into predefined classes."""
    if duration <= 30:
        return 0
    elif duration <= 60:
        return 1
    elif duration <= 120:
        return 2
    else:
        return 3


def generate_cyclical_features(hour, minute):
    """Cyclic encoding for datetime inputs"""
    hour_sin = np.sin(2 * np.pi * hour / 24)
    hour_cos = np.cos(2 * np.pi * hour / 24)
    minute_sin = np.sin(2 * np.pi * minute / 60)
    minute_cos = np.cos(2 * np.pi * minute / 60)
    return hour_sin, hour_cos, minute_sin, minute_cos


def prepare_data_training(df):
    '''Prepare data for training'''
    # Categorize duration and one-hot encode priority
    y_duration = df['Duration in min'].apply(categorize_duration)
    y_priority = pd.get_dummies(df['Priority'])
    # Drop unnecessary columns
    df = df.drop(columns=['Duration in min'])
    df = df.drop(columns=['Priority'])
    # One-hot encoded format for categorical features
    categorical_features = ['Task Type', 'Day of Week']
    X_categorical = pd.get_dummies(df[categorical_features])
    # Boolean features
    boolean_features = ['has Description', 'has Address', 'has URL', 'is Complete']
    X_boolean = df[boolean_features]
    # Cyclical features for time
    cyclical_features = ['hour_start_sin', 'hour_start_cos', 'minute_start_sin', 'minute_start_cos']
    X_cyclical = df[cyclical_features]
    # Combine all features into a single DataFrame
    X = pd.concat([X_categorical, X_boolean, X_cyclical], axis=1)
    return X, y_duration, y_priority


def load_and_prepare_data(filepath):
    """Load and prepare data from a CSV file."""
    df = pd.read_csv(filepath)
    return prepare_data_training(df)


def split_and_convert(X, y_duration, y_priority, test_size=0.2, random_state=42):
    """
    Split the data into training and testing sets, convert data types for TensorFlow/Keras,
    and save the data to disk.
    """
    # Splitting the dataset into training and testing sets
    X_train, X_test, y_duration_train, y_duration_test, y_priority_train, y_priority_test = train_test_split(
        X, y_duration, y_priority, test_size=test_size, random_state=random_state
    )
    # Converting features and labels to float32 for compatibility with TensorFlow/Keras
    X_train = X_train.astype('float32')
    X_test = X_test.astype('float32')
    y_duration_train = y_duration_train.astype('int32')  # Use int32 for categorical labels
    y_duration_test = y_duration_test.astype('int32')
    y_priority_train = y_priority_train.astype('float32')
    y_priority_test = y_priority_test.astype('float32')
    # Save the prepared data
    np.save('./X_train_v2_2.npy', X_train)
    np.save('./X_test_v2_2.npy', X_test)
    np.save('./y_duration_train_v2_2.npy', y_duration_train)
    np.save('./y_duration_test_v2_2.npy', y_duration_test)
    np.save('./y_priority_train_v2_2.npy', y_priority_train)
    np.save('./y_priority_test_v2_2.npy', y_priority_test)
    return X_train, X_test, y_duration_train, y_duration_test, y_priority_train, y_priority_test


def prepare_data_prediction(df):
    # Prepare features without considering the duration and priority columns
    X_categorical = pd.get_dummies(df[['Task Type', 'Day of Week']])
    X_boolean = df[['has Description', 'has Address', 'has URL', 'is Complete']]
    X_cyclical = df[['hour_start_sin', 'hour_start_cos', 'minute_start_sin', 'minute_start_cos']]
    X = pd.concat([X_categorical, X_boolean, X_cyclical], axis=1)
    return X
