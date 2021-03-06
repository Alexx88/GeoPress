jQuery(function($) {
	$gp.notices.init();
	$('#map_id').change(function() {
		var select = $(this);
		var map_id = $('option:selected', select).attr('value');
		if ( !map_id ) {
			$('#submit').attr('disabled', 'disabled');
			$('#preview').hide();
			return;
		}
		$gp.notices.notice($gp_mass_create_sets_options.loading);
		select.attr('disabled', 'disabled');
		$.ajax({type: "POST", url: $gp_mass_create_sets_options.url, data: {map_id: map_id}, dataType: 'json',
			success: function(data){
				select.attr('disabled', '');
				$gp.notices.clear();
				if (data.added.length || data.removed.length) $('#submit').attr('disabled', '');
				var preview = $('#preview');
				preview.html('<h3>Preview changes:</h3>');
				var preview_html = '';
				preview_html += '<ul>';
				function preview_html_for(kind, text) {
					var sets = data[kind];
					var html = '';					
					html += '<li><span class="'+kind+'">'+text.replace('{count}', sets.length)+'</span>';
					if (sets.length) {
						html += '<ul>';
						$.each(sets, function() {
							html += '<li>'+$gp.esc_html(this.name)+' ('+this.locale+'/'+this.slug+')</li>';
						});
						html += '</ul>';
					}
					html += '</li>';
					return html;
				}
				preview_html += preview_html_for('added', '{count} set(s) will be added');
				preview_html += preview_html_for('removed', '{count} set(s) will be removed');
				preview_html += '</ul>';
				preview.append(preview_html);
				preview.fadeIn();
			},
			error: function(xhr, msg, error) {
				select.attr('disabled', '');
				msg = xhr.responsehtml? 'Error: '+ xhr.responsehtml : 'Error saving the translation!';
				$gp.notices.error(msg);
			}
		});		
	});
	$('#submit').attr('disabled', 'disabled');
	$('#preview').hide();
});