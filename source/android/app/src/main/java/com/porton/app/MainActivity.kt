package com.porton.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContent {
      MaterialTheme {
        PortonApp()
      }
    }
  }
}

@Composable
fun PortonApp(viewModel: MainViewModel = viewModel()) {
  val state = viewModel.uiState
  if (state.token == null) {
    LoginScreen(
      email = state.email,
      password = state.password,
      isLoading = state.isLoading,
      error = state.error,
      onEmailChange = viewModel::updateEmail,
      onPasswordChange = viewModel::updatePassword,
      onSubmit = viewModel::login,
    )
  } else {
    DashboardScreen(
      deviceId = state.deviceId,
      isLoading = state.isLoading,
      isGateActive = state.isGateActive,
      statusMessage = state.statusMessage,
      error = state.error,
      onDeviceIdChange = viewModel::updateDeviceId,
      onOpenGate = viewModel::openGate,
      onLogout = viewModel::logout,
    )
  }
}

@Composable
fun LoginScreen(
  email: String,
  password: String,
  isLoading: Boolean,
  error: String?,
  onEmailChange: (String) -> Unit,
  onPasswordChange: (String) -> Unit,
  onSubmit: () -> Unit,
) {
  Column(
    modifier = Modifier
      .fillMaxSize()
      .padding(24.dp),
    verticalArrangement = Arrangement.Center,
    horizontalAlignment = Alignment.CenterHorizontally,
  ) {
    Text(text = "Porton", style = MaterialTheme.typography.headlineMedium)
    Spacer(modifier = Modifier.height(24.dp))
    OutlinedTextField(
      value = email,
      onValueChange = onEmailChange,
      label = { Text("Email") },
      modifier = Modifier.fillMaxWidth(),
      keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
      enabled = !isLoading,
      colors = TextFieldDefaults.outlinedTextFieldColors(),
    )
    Spacer(modifier = Modifier.height(12.dp))
    OutlinedTextField(
      value = password,
      onValueChange = onPasswordChange,
      label = { Text("Contrasena") },
      modifier = Modifier.fillMaxWidth(),
      visualTransformation = PasswordVisualTransformation(),
      enabled = !isLoading,
      colors = TextFieldDefaults.outlinedTextFieldColors(),
    )
    if (error != null) {
      Spacer(modifier = Modifier.height(12.dp))
      Text(text = error, color = MaterialTheme.colorScheme.error)
    }
    Spacer(modifier = Modifier.height(16.dp))
    Button(
      onClick = onSubmit,
      enabled = !isLoading,
      modifier = Modifier.fillMaxWidth(),
    ) {
      Text(if (isLoading) "Ingresando..." else "Ingresar")
    }
  }
}

@Composable
fun DashboardScreen(
  deviceId: String,
  isLoading: Boolean,
  isGateActive: Boolean,
  statusMessage: String?,
  error: String?,
  onDeviceIdChange: (String) -> Unit,
  onOpenGate: () -> Unit,
  onLogout: () -> Unit,
) {
  val buttonColors = if (isGateActive) {
    ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.tertiary)
  } else {
    ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
  }

  Column(
    modifier = Modifier
      .fillMaxSize()
      .padding(24.dp),
    verticalArrangement = Arrangement.Center,
    horizontalAlignment = Alignment.CenterHorizontally,
  ) {
    Text(text = "Abrir porton", style = MaterialTheme.typography.headlineSmall)
    Spacer(modifier = Modifier.height(16.dp))
    OutlinedTextField(
      value = deviceId,
      onValueChange = onDeviceIdChange,
      label = { Text("Device ID") },
      modifier = Modifier.fillMaxWidth(),
      enabled = !isLoading && !isGateActive,
    )
    Spacer(modifier = Modifier.height(16.dp))
    Button(
      onClick = onOpenGate,
      enabled = !isLoading && !isGateActive,
      modifier = Modifier.fillMaxWidth(),
      colors = buttonColors,
    ) {
      Text(if (isGateActive) "Abriendo..." else "Abrir")
    }
    if (statusMessage != null) {
      Spacer(modifier = Modifier.height(12.dp))
      Text(text = statusMessage)
    }
    if (error != null) {
      Spacer(modifier = Modifier.height(12.dp))
      Text(text = error, color = MaterialTheme.colorScheme.error)
    }
    Spacer(modifier = Modifier.height(24.dp))
    Button(onClick = onLogout, modifier = Modifier.fillMaxWidth()) {
      Text("Cerrar sesion")
    }
  }
}

data class UiState(
  val email: String = "",
  val password: String = "",
  val deviceId: String = "porton-001",
  val token: String? = null,
  val isLoading: Boolean = false,
  val isGateActive: Boolean = false,
  val statusMessage: String? = null,
  val error: String? = null,
)

class MainViewModel : ViewModel() {
  var uiState by mutableStateOf(UiState())
    private set

  private val apiClient = ApiClient()
  private var gateJob: Job? = null

  fun updateEmail(value: String) {
    uiState = uiState.copy(email = value, error = null)
  }

  fun updatePassword(value: String) {
    uiState = uiState.copy(password = value, error = null)
  }

  fun updateDeviceId(value: String) {
    uiState = uiState.copy(deviceId = value, error = null)
  }

  fun login() {
    if (uiState.isLoading) return
    viewModelScope.launch {
      uiState = uiState.copy(isLoading = true, error = null)
      val result = apiClient.login(uiState.email, uiState.password)
      uiState = if (result.isSuccess) {
        uiState.copy(token = result.getOrNull(), isLoading = false, password = "")
      } else {
        uiState.copy(isLoading = false, error = result.exceptionOrNull()?.message)
      }
    }
  }

  fun logout() {
    gateJob?.cancel()
    uiState = UiState()
  }

  fun openGate() {
    if (uiState.isLoading || uiState.isGateActive) return
    val token = uiState.token ?: return
    viewModelScope.launch {
      uiState = uiState.copy(isLoading = true, error = null, statusMessage = null)
      val result = apiClient.openGate(token, uiState.deviceId)
      if (result.isSuccess) {
        uiState = uiState.copy(
          isLoading = false,
          isGateActive = true,
          statusMessage = "Comando enviado",
        )
        gateJob?.cancel()
        gateJob = viewModelScope.launch {
          delay(10_000)
          uiState = uiState.copy(isGateActive = false, statusMessage = "Listo")
        }
      } else {
        uiState = uiState.copy(
          isLoading = false,
          isGateActive = false,
          error = result.exceptionOrNull()?.message,
        )
      }
    }
  }
}

class ApiClient {
  private val client = OkHttpClient()
  private val jsonType = "application/json; charset=utf-8".toMediaType()
  private val baseUrl = BuildConfig.API_BASE_URL.trimEnd('/')

  suspend fun login(email: String, password: String): Result<String> {
    return withContext(Dispatchers.IO) {
      val body = JSONObject()
        .put("email", email)
        .put("password", password)
        .toString()
      val request = Request.Builder()
        .url("$baseUrl/api/auth/login")
        .post(body.toRequestBody(jsonType))
        .build()
      client.newCall(request).execute().use { response ->
        if (!response.isSuccessful) {
          return@withContext Result.failure(Exception("Login fallido"))
        }
        val payload = JSONObject(response.body?.string() ?: "{}")
        val token = payload.optString("access_token", null)
        if (token.isNullOrBlank()) {
          return@withContext Result.failure(Exception("Token no recibido"))
        }
        Result.success(token)
      }
    }
  }

  suspend fun openGate(token: String, deviceId: String): Result<Unit> {
    return withContext(Dispatchers.IO) {
      val body = JSONObject()
        .put("deviceId", deviceId)
        .toString()
      val request = Request.Builder()
        .url("$baseUrl/api/gates/open")
        .post(body.toRequestBody(jsonType))
        .addHeader("Authorization", "Bearer $token")
        .build()
      client.newCall(request).execute().use { response ->
        if (!response.isSuccessful) {
          return@withContext Result.failure(Exception("No se pudo abrir el porton"))
        }
        Result.success(Unit)
      }
    }
  }
}
