var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Document = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("DocumentStore")],

  getInitialState: function() {
    return {
      paragraphs: [],
      selectedParagraphIndex: null
    };
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("DocumentStore").getState();
  },

  componentDidMount: function() {
    paragraphs = [];
    i = 0;
    this.props.document.body.replace(/<p>(.*?)<\/p>/g, function () {
      paragraphs.push({body: arguments[1], index: i});
      i+=1;
    });
    this.setState({paragraphs: paragraphs});

    window.addEventListener("keydown", function(e){
      // ESC is pressed
      if(e.which == 27) {
        this.selectParagraph(null);
      }
    }.bind(this));

    this.getFlux().actions.loadContributions(this.props.document.id);
  },

  selectParagraph: function(index) {
    this.setState({selectedParagraphIndex: index});
  },

  render: function() {
    paragraphNodes = this.state.paragraphs.map(function (paragraph){
      return (
        <Paragraph
          formOpen={this.state.selectedParagraphIndex == paragraph.index}
          selectParagraph={this.selectParagraph}
          selectedParagraphIndex={this.state.selectedParagraphIndex}
          paragraph={paragraph}
          currentUser={this.props.currentUser}
          documentId={this.props.document.id}/>
      );
    }.bind(this));

    return <div>{paragraphNodes}</div>
  }
});
