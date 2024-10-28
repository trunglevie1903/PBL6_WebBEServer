# Note about work (plans, errors, bugs, logic, flow, ...)

## Date 21/10/24

### 1. Plan

#### a. User personal management

##### Profile (name, username, password, email)

- Get profile

  There is two types of requests of getting a user's profile: a user get the profile of a user (self or another user) to see, and user get its profile to edit data.

  Profile contains:
  - Banner image, avatar image, user's description (from UserProfile model)
  - Username, name, email (from User model)

  Work flow for BE server:
  - Router receive request to fetch user's profile, call the corresponding controller function.
  - Controller function will extract user's ID, then call a service to fetch user's profile with that ID
  - A service will try to return a profile with the above structure from the ID passed in
  - Controller function return a response based on service's work result
  - Router send the response back to where the request came.

  Request structures:
  - **/user/key/:userId**: Request to fetch the profile of a user (self or other)
    - Input:
      - request params:
        - **userId**: string
    - Output: object
      - userId: string
      - name: string
      - description: string
      - bannerImage: string
      - avatarImage: string

  - **/user/self**: Request to get self's profile
    - Input:
      - _accessToken_ on **Authorization** header
    - Output: object
      - userId: string
      - name: string
      - description: string
      - bannerImage: string
      - avatarImage: string

- Update profile

  Work flow:
  - FE page send a request to BE, try to fetch user's self profile
  - BE send a response contained profile data, or error
  - FE page will crush the response profile data into fields, pass it to every field's self form component. Which means, every field has its own form to handle its request to update new value.

  Request structure:
  - **/user/update-self-name**: Request to update self's profile name
    - Input:
      - _accessToken_ on **Authorization** header
      - request body:
        - **name**: string
    - Output: object
      - message: string

  - **/user/update-self-description**: Request to update self's profile description
    - Input:
      - _accessToken_ on **Authorization** header
      - request body:
        - **description**: string
    - Output: object
      - message: string

  - **/user/update-self-banner-image**: Request to update self's profile banner image
    - Input:
      - _accessToken_ on **Authorization** header
      - request body:
        - **bannerImage**: string
    - Output: object
      - message: string

  - **/user/update-self-avatar-image**: Request to update self's profile avatar image
    - Input
      - _accessToken_ on **Authorization** header
      - request body:
        - **avatarImage**: string
    - Output: object
      - message: string

- Update password

##### Personal uploaded videos

- Get uploaded videos with status is "public" or "draft"
- Edit an uploaded video's content (title, description, videoFile)
- Delete an uploaded video (change its status to removed)

##### Personal liked videos

- Get all liked videos with status "public"
- Edit like status ("liked", "disliked", null) of a liked video

##### Personal saved videos

- Get all saved playlist of user (there is a default playlist "Watch later" for all users)
- Edit playlist data (name, description, publicStatus)
- Add video into playlist
- Remove a video from playlist

#### b. Video's Comment

- Create direct-to-video comment (no parent comment)
- Show direct-to-video comment
- Create child comment (reply to a previous comment)
- Show child comment
- Edit personal comment (include checking if the comment is wrote by user)
- Delete personal comment (include checking if the comment is wrote by user)

#### c. Admin management

##### User management

##### Video management

##### Comment management

### 2. Bugs

#### a. Video watch page

- Video card on "Other videos" section is overlapping the modal from "Header" element's "ProfileButton" button

- "Like" and "Dislike" conflict: If "likeStatus" is "liked" and the "Dislike" button on UI is clicked, an AxiosError will drop

- Shorten transcript:

  - Put the transcript into a modal, add a button that will show the transcript modal on click

  - Or only load some first words on page load, and show full content after a "Show more" button is clicked

- User mini profile data is not updated, because there is currently no code to request this data

- Default summary value is right now "1"

#### b. Home page

- Less then 4 videos problem: Column placing is wrong

  - Column dynamic count

  |Screen width|Column count|
  |-|-|
  |>= 1000px|3|
  |>= 600px|2|
  |< 600px|1|
  
  - When screen width is > 1300px and only 2 videos is available on system, these two will be put at the position like
  ```justifyContent = space-between```

#### c. Upload video page

- Upload button is not blocking while waiting for BE's response

- 