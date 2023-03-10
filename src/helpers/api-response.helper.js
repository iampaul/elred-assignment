class ApiResponse {      
  constructor(data, message) {
      this.message = message;
      if(data) {
        this.response = { ...data };
      }      
  }
}

module.exports = {
  ApiResponse
}