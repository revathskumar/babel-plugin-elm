module Test exposing (..)

import Html exposing (Html, div, text, beginnerProgram)

type alias Model =
  String


model : Model
model = "abc"


type Msg =
  NoOp


view : Model -> Html Msg
view model =
  div [] [ text ("Hello" ++ model) ]

update : Msg -> Model -> Model
update msg model = model


main : Program Never Model Msg
main =
  beginnerProgram
    { model = model
    , update = update
    , view = view
    }
