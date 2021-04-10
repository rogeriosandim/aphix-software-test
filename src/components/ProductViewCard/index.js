import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Typography,
} from '@material-ui/core';
import {
  Favorite as FavoriteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import parse from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 355,
  },
  header: {
    height: 140,
  },
  media: {
    height: 355,
    width: 355,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  favourite: {
    color: '#6b778c',
  },
  favouriteSet: {
    color: '#FF0000',
  },
}));

const ProductViewCard = (props) => {
  const {
    name,
    description,
    metaKeywords,
    image,
    sku,
    imageName,
    isOnline,
  } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [favourite, setFavourite] = useState(false);
  const parsedDescription = parse(`${description}`);
  const parsedName = parse(`${name}`);
  const offlineImage = localStorage.getItem('defaultImage');

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleHeartClick = () => {
    setFavourite(!favourite);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.header}
        title={parsedName}
        subheader={sku}
      />
      <CardMedia
        id='image'
        className={classes.media}
        image={
          isOnline
            ? `https://webshop-staging.aphixsoftware.com/${image}`
            : `${offlineImage}`
        }
        title={imageName}
      />
      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.favourite, {
            [classes.favouriteSet]: favourite,
          })}
          onClick={handleHeartClick}
          aria-label='add to favourite'
        >
          <FavoriteIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label='show more'
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          <Typography variant='body2' color='textSecondary' component='div'>
            {parsedDescription}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='div'>
            {metaKeywords}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ProductViewCard;
