# app/controllers/authentication_controller.rb

class AuthenticationController < ApplicationController
# JWT Auth
#  skip_before_action :authenticate_request

  def authenticate
    command = AuthenticateUser.call(params[:email], params[:password])

    if command.success?
      render json: { auth_token: command.result }
    else
      render json: { error: command.errors }, status: :unauthorized
    end
  end

  def register
    email = params[:email]
    password = params[:password]

    users = User.where('email = ?', email)
    if users.count() > 0
      render json: { error: '電子郵件存在!' }, status: 500
    else
      user = User.create!(
        email: email,
        password: password
      )

      if user != nil?
        render json: { message: '註冊成功!' }
      else
        render json: { error: '註冊失敗!' }, status: 500
      end
    end
  end
end