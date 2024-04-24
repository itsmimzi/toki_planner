from tensorflow.keras.models import load_model
from tensorflow.keras.callbacks import EarlyStopping
from dataPreparation_v2 import *

# Load the prepared data for training
X, y_duration, y_priority = load_and_prepare_data('./synthetic_task_data_v2.csv')

# Split the data into training and testing sets
X_train, X_test, y_duration_train, y_duration_test, y_priority_train, y_priority_test = split_and_convert(X, y_duration, y_priority)

# Load the pre-trained model
model = load_model('./mlp_v2_20.h5')

# Configure early stopping to prevent overfitting
early_stopping = EarlyStopping(
    monitor='val_loss',
    patience=20,
    restore_best_weights=True
)
# Train the model with the training dataset
history = model.fit(
    X_train, {'duration_output': y_duration_train, 'priority_output': y_priority_train},
    epochs=50,
    batch_size=100,
    validation_split=0.2,
    # callbacks=[early_stopping],
    verbose=1,
)

# Print output
print("___________________________________")
epochs = 50
print(f'number of epochs: {epochs}')
print("___________________________________")
print("RESULTS AFTER TRAINING AND VALIDATION")
mlpHistory = history.history
# Retrieve and print validation accuracies for the last epoch
print(f'val_duration_output_accuracy: {mlpHistory["val_duration_output_accuracy"][epochs-1]}')
print(f'val_priority_output_accuracy: {mlpHistory["val_priority_output_accuracy"][epochs-1]}')
print("___________________________________")
# Evaluate the model's performance on the test dataset
test_results = model.evaluate(
    X_test, {'duration_output': y_duration_test, 'priority_output': y_priority_test},
    verbose=1
)
print("___________________________________")
print("RESULTS AFTER TESTING")
for i,j in zip(model.metrics_names, test_results):
    print(f'{i}: {j}')

#Saving the model
model.save('./mlp_v2_20_1.h5')
