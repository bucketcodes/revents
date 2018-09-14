import React, {Component} from 'react';
import {Button, Card, Grid, Header, Icon, Image, Item, List, Menu, Segment} from "semantic-ui-react";
import { connect } from 'react-redux'
import { format } from 'date-fns'
import { firestoreConnect } from "react-redux-firebase";
import { compose } from 'redux'
import differenceInYears from 'date-fns/difference_in_years'
import { UserDetailedEvents } from './UserDetailedEvents'

const query = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "photos" }],
      storeAs: "photos"
    }
  ];
};

const mapState = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  photos: state.firestore.ordered.photos,
})

class UserDetailedPage extends Component {

    render() {
    const { auth, profile, photos } = this.props;
        return (
            <Grid>
                <Grid.Column width={16}>
                    <Segment>
                        <Item.Group>
                            <Item>
                                <Item.Image avatar size='small' src={profile.photoURL || '/assets/user.png'}/>
                                <Item.Content verticalAlign='bottom'>
                                    <Header as='h1'>{auth.displayName}</Header>
                                    <br/>
                                    {profile.occupation && 
                                    <Header as='h3'>{profile.occupation}</Header>}
                                    <br/>
                                    <Header as='h3'>{ profile.dateOfBirth && differenceInYears(Date.now(), profile.dateOfBirth.toDate()) }{profile.city && `, Lives in ${profile.city}` || ', Might be homeless'}</Header>
                                </Item.Content>
                            </Item>
                        </Item.Group>

                    </Segment>
                </Grid.Column>
                <Grid.Column width={12}>
                    <Segment>
                        <Grid columns={2}>
                            <Grid.Column width={10}>
                                <Header icon='smile' content={`About ${auth.displayName}`}/>
                                {profile.occupation && <p>I am a: <strong>{profile.occupation}</strong></p>}
                                {profile.origin && <p>Originally from <strong>{profile.origin}</strong></p>}
                                <p>Member Since: <strong>{profile.createdAt && format(profile.createdAt.toDate(), 'Do MMMM YYYY')}</strong></p>
                                <p>{profile.about || 'You will just have to ask to find out, won\'t you.'}</p>

                            </Grid.Column>
                            <Grid.Column width={6}>

                                <Header icon='heart outline' content='Interests'/>
                                <List>
                                  {profile.interests && profile.interests.length >= 1 ? profile.interests.map(interest => (
                                    <Item>
                                      <Icon name='heart'/>
                                      <Item.Content>{interest}</Item.Content>
                                    </Item>
                                  )) : 'No interests!'}
                                </List>
                            </Grid.Column>
                        </Grid>

                    </Segment>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Segment>
                        <Button color='teal' fluid basic content='Edit Profile'/>
                    </Segment>
                </Grid.Column>

                {photos && photos.length > 1 && <Grid.Column width={12}>
                    <Segment attached>
                        <Header icon='image' content='Photos'/>
                        
                        <Image.Group size='small'>
                            {photos.map(photo => <Image src={photo.url}/>)}
                        </Image.Group>
                    </Segment>
                </Grid.Column>}

                {/* static for now */}
                <UserDetailedEvents />
            </Grid>

        );
    }
}

export default compose(
  connect(mapState, null),
  firestoreConnect(auth => query(auth))
)(UserDetailedPage)