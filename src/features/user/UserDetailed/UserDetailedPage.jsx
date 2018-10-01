import React, { Component } from "react";
import {
  Button,
  Grid,
  Header,
  Icon,
  Item,
  List,
  Segment
} from "semantic-ui-react";
import { connect } from "react-redux";
import { format } from "date-fns";
import { firestoreConnect, isEmpty } from "react-redux-firebase";
import { compose } from "redux";
import differenceInYears from "date-fns/difference_in_years";
import { UserDetailedEvents } from "./UserDetailedEvents";
import { userDetailedQuery } from "../userQueries";
import { Link } from "react-router-dom";
import { UserDetailedPhotos } from "./UserDetailedPhotos";
import LoadingComponent from '../../../app/layout/LoadingComponent'

const mapState = (state, ownProps) => {
  let userUid = null;
  let profile = [];
  if (ownProps.match.params.id === state.auth.uid) {
    profile = state.firebase.profile;
  } else {
    profile =
      !isEmpty(state.firestore.ordered.profile) &&
      state.firestore.ordered.profile[0];
    userUid = ownProps.match.params.id;
  }
  return {
    auth: state.firebase.auth,
    userUid,
    profile,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting
  };
};

class UserDetailedPage extends Component {
  render() {
    const { auth, profile, photos, match, requesting } = this.props;
    const isCurrentUser = auth.uid === match.params.id;
    const loading = Object.values(requesting).some(a => a === true);

    if (loading) return <LoadingComponent inverted={true}/>

    return (
      <Grid>
        <Grid.Column width={16}>
          <Segment>
            <Item.Group>
              <Item>
                <Item.Image
                  avatar
                  size="small"
                  src={profile.photoURL || "/assets/user.png"}
                />
                <Item.Content verticalAlign="bottom">
                  <Header as="h1">{profile.displayName}</Header>
                  <br />
                  {profile.occupation && (
                    <Header as="h3">{profile.occupation}</Header>
                  )}
                  <br />
                  <Header as="h3">
                    {profile.dateOfBirth &&
                      differenceInYears(
                        Date.now(),
                        profile.dateOfBirth.toDate()
                      )}
                    {(profile.city && `, Lives in ${profile.city}`) ||
                      ", Might be homeless"}
                  </Header>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Grid.Column>
        <Grid.Column width={12}>
          <Segment>
            <Grid columns={2}>
              <Grid.Column width={10}>
                <Header icon="smile" content={`About ${profile.displayName}`} />
                {profile.occupation && (
                  <p>
                    I am a: <strong>{profile.occupation}</strong>
                  </p>
                )}
                {profile.origin && (
                  <p>
                    Originally from <strong>{profile.origin}</strong>
                  </p>
                )}
                <p>
                  Member Since:{" "}
                  <strong>
                    {profile.createdAt &&
                      format(profile.createdAt.toDate(), "Do MMMM YYYY")}
                  </strong>
                </p>
                <p>
                  {profile.about ||
                    "You will just have to ask to find out, won't you."}
                </p>
              </Grid.Column>
              <Grid.Column width={6}>
                <Header icon="heart outline" content="Interests" />
                <List>
                  {profile.interests && profile.interests.length >= 1
                    ? profile.interests.map(interest => (
                        <Item>
                          <Icon name="heart" />
                          <Item.Content>{interest}</Item.Content>
                        </Item>
                      ))
                    : "No interests!"}
                </List>
              </Grid.Column>
            </Grid>
          </Segment>
        </Grid.Column>
        <Grid.Column width={4}>
          <Segment>
            {isCurrentUser ? (
              <Button
                as={Link}
                to="/settings"
                color="teal"
                fluid
                basic
                content="Edit Profile"
              />
            ) : (
              <Button color="teal" fluid basic content="Follow User" />
            )}
          </Segment>
        </Grid.Column>

        {photos && photos.length > 1 && <UserDetailedPhotos photos={photos} />}

        {/* static for now */}
        <UserDetailedEvents />
      </Grid>
    );
  }
}

export default compose(
  connect(
    mapState,
    null
  ),
  firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid))
)(UserDetailedPage);
