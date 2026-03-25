import os
from tensorflow.keras.models import load_model
import pandas as pd
from tokiBackend.toki_NN.dataPreparation_v2 import generate_cyclical_features, prepare_data_prediction, load_and_prepare_data

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Duration thresholds in minutes for categorization
GLOBAL_DURATION_CLASS = [20, 60, 100, 180]
# Priority categories used during one-hot encoding
GLOBAL_PRIORITY_CLASS = ['ASAP', 'high', 'low', 'medium']


def predict_task(task_data):
    """
    Predicts task duration and priority based on provided task details.
    Args:
        task_data (dict): Dictionary containing details of the task with keys:
            'Task Type', 'Day of Week', 'has Description', 'has Address',
            'has URL', 'is Complete', 'Start Time'.
    Returns:
        tuple: A tuple containing arrays for duration and priority predictions.
    """

    # Convert the dictionary into a pandas DataFrame
    df = pd.DataFrame(task_data)
    # Convert 'Start Time' from string to datetime format and extract hour and minute
    df['Start Time'] = pd.to_datetime(df['Start Time'], format='%H:%M')
    df['hour_start'] = df['Start Time'].dt.hour
    df['minute_start'] = df['Start Time'].dt.minute
    df['hour_start_sin'], df['hour_start_cos'], df['minute_start_sin'], df['minute_start_cos'] = generate_cyclical_features(df['hour_start'], df['minute_start'])

    # Prepare data for prediction using predefined function from 'dataPreparation_v2'
    X_new = prepare_data_prediction(df)

    # Load training data structure to ensure consistency in feature format
    csv_path = os.path.join(BASE_DIR, 'synthetic_task_data_v2.csv')
    X_train = load_and_prepare_data(csv_path)[0]
    # The model was trained without priority as an input feature — drop those columns
    X_train = X_train.drop(columns=[c for c in GLOBAL_PRIORITY_CLASS if c in X_train.columns])
    X_train_columns = X_train.columns

    # Add missing columns in X_new that exist in X_train with default value of 0
    for col in X_train_columns:
        if col not in X_new.columns:
            X_new[col] = 0

    # Order X_new columns as in X_train and convert to float32
    X_new = X_new[X_train_columns]
    X_new = X_new.astype('float32')

    # Load the trained model and predict
    model_path = os.path.join(BASE_DIR, 'mlp_v2_20_1.h5')
    mlp = load_model(model_path)
    predictions = mlp.predict(X_new)
    duration_pred, priority_pred = predictions

    return duration_pred, priority_pred


def format_predictions(predictions):
    """
    Formats the output from the predict_task function and maps probabilities to labels.
    Args:
        predictions (tuple): Raw (duration, priority) predictions from the model.
    Returns:
        tuple: Human-readable (duration_label, priority_label).
    """
    duration_pred, priority_pred = predictions
    duration_probs = [[f"{prob:.3f}" for prob in duration_pred[0]]]
    priority_probs = [[f"{prob:.3f}" for prob in priority_pred[0]]]
    duration_label = get_max_label(duration_probs, GLOBAL_DURATION_CLASS)
    priority_label = get_max_label(priority_probs, GLOBAL_PRIORITY_CLASS)
    return duration_label, priority_label


def get_max_label(probabilities, labels):
        """
         Map probabilities to labels and return the label with the highest probability.
         Args:
             probabilities (list): A list of probabilities.
             labels (list): Corresponding labels for each probability.
         Returns:
             any: The label with the highest probability.
         """
        mapped_probs = {label: float(prob) for label, prob in zip(labels, probabilities[0])}
        max_label = max(mapped_probs, key=mapped_probs.get)
        return max_label


if __name__ == '__main__':
    task = {
        'Task Type': ['meeting'],
        'Day of Week': ['Tuesday'],
        'has Description': [False],
        'has Address': [False],
        'has URL': [False],
        'is Complete': [True],
        'Start Time': ['10:00'],
        'Priority': [''],
    }
    predictions = predict_task(task)
    duration_label = format_predictions(predictions)
    print("predictionDuration:", duration_label)

