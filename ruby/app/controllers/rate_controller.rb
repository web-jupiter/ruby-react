class RateController < ApplicationController
  def index
    rates = Rate.all()
    values = {}
    for rate in rates
      values[rate.id] = 1
    end

    render json: {rates: rates, rate_values: values}
  end
end
