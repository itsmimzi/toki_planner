from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from dataPreparation_v2 import *
import matplotlib.pyplot as plt


def build_mlp_model(input_shape):
    """
    Build and return a Multi-Layer Perceptron (MLP) model configured for multi-output classification.

    Args:
        input_shape (int): Number of input features, determines the shape of the input layer.

    Returns:
        Model: A compiled Keras model ready for training.
    """
    inputs = Input(shape=(input_shape,))
    x = Dense(256, activation='relu')(inputs)
    x = Dropout(0.5)(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(40, activation='relu')(x)
    # 2 Output layers for duration classification and priority classification
    # Both use softmax to output a probability distribution
    duration_output = Dense(4, activation='softmax', name='duration_output')(x)
    # priority_output = Dense(4, activation='softmax', name='priority_output')(x)

    # Creating the model by specifying inputs and outputs
    model = Model(inputs=inputs, outputs=[duration_output])

    # Compiling the model with Adam optimizer and specifying loss functions for each output
    model.compile(optimizer=Adam(learning_rate=0.001),
                  loss={'duration_output': 'sparse_categorical_crossentropy'},
                  metrics={'duration_output': 'accuracy'})
    return model


# Load and prepare data
X, y_duration = load_and_prepare_data('./synthetic_task_data_v2.csv')
X_train, X_test, y_duration_train, y_duration_test = split_and_convert(X, y_duration)

# Determine the input feature shape from training data
input_shape = X_train.shape[1]
mlp = build_mlp_model(input_shape)

history = mlp.fit(
    X_train, {'duration_output': y_duration_train},
    epochs=10,      #EPOCH MUST BE UPDATED BELOW EVERYTIME ITS VALUE IS CHANGED
    batch_size=2000,
    validation_split=0.2,
    verbose=1,
)

# Summarize training results after completion
print("___________________________________")
epochs = 10
print(f'number of epochs: {epochs}')
print("___________________________________")
print("RESULTS AFTER TRAINING AND VALIDATION")
mlpHistory = history.history
print(f'val_accuracy: {mlpHistory["val_accuracy"][epochs-1]}')
# print(f'val_priority_output_accuracy: {mlpHistory["val_priority_output_accuracy"][epochs-1]}')
print("___________________________________")

# Evaluate the model on the testing set
test_results = mlp.evaluate(
    X_test, {'duration_output': y_duration_test},
    verbose=1
)
print("___________________________________")
print("RESULTS AFTER TESTING")
for i,j in zip(mlp.metrics_names, test_results):
    print(f'{i}: {j}')

# Save the trained model
mlp.save('./mlp_v4.h5')

# plt.figure(figsize=(12, 6))
# plt.subplot(1, 2, 1)
# plt.plot(history.history['duration_output_accuracy'], label='Duration Accuracy')
# plt.plot(history.history['val_duration_output_accuracy'], label='Val Duration Accuracy')
# plt.title('Accuracy Over Epochs')
# plt.xlabel('Epochs')
# plt.ylabel('Accuracy')
# plt.legend()
#
# plt.subplot(1, 2, 2)
# plt.plot(history.history['loss'], label='Training Loss')
# plt.plot(history.history['val_loss'], label='Validation Loss')
# plt.plot(history.history['val_priority_output_accuracy'], label='Val Priority Accuracy')
# plt.title('Accuracy Over Epochs')
# plt.xlabel('Epochs')
# plt.ylabel('Accuracy')
# plt.legend()

# plt.show()

# mlp.summary()


