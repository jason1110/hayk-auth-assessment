class UsersController < ApplicationController
  def create
    @user = User.new user_params

    if @user.save
      render json: { user: @user }, status: :created
    else
      render({
        json: {
          error: @user.errors.messages.values.join(", "),
        },
        status: :bad_request,
      }) 
    end
  end

  private
  def user_params
    params.require(:user).permit(:username, :password)
  end
end
